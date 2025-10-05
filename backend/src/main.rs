use actix_cors::Cors;
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use rdkafka::producer::{FutureProducer, FutureRecord};
use rdkafka::consumer::{StreamConsumer, Consumer};
use rdkafka::Message;
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tokio::time::sleep;
use rand::{Rng, SeedableRng};
use rand::rngs::StdRng;
use chrono::Utc;

#[derive(Debug, Serialize, Deserialize, Clone)]
struct RSIData {
    token_address: String,
    rsi: f64,
    timestamp: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct TradeData {
    token_address: String,
    price_in_sol: f64,
    timestamp: String,
}

#[get("/rsi")]
async fn get_rsi(data: web::Data<AppState>) -> impl Responder {
    let rsi = data.rsi.lock().unwrap();
    HttpResponse::Ok().json(&*rsi)
}

#[get("/trades")]
async fn get_trades(data: web::Data<AppState>) -> impl Responder {
    let trades = data.trades.lock().unwrap();
    HttpResponse::Ok().json(&*trades)
}

struct AppState {
    rsi: Arc<Mutex<Vec<RSIData>>>,
    trades: Arc<Mutex<Vec<TradeData>>>,
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    println!("🦀 RSI Processor + API with Data Generation started...");

    let rsi = Arc::new(Mutex::new(Vec::new()));
    let trades = Arc::new(Mutex::new(Vec::new()));

    let app_state = web::Data::new(AppState {
        rsi: rsi.clone(),
        trades: trades.clone(),
    });

    // ✅ Thread-safe RNG
    let rsi_clone = rsi.clone();
    let trades_clone = trades.clone();

    // Spawn background data generator (thread-safe now)
    tokio::spawn(async move {
        let mut rng = StdRng::from_entropy(); // ✅ replaces thread_rng()
        loop {
            let token = format!("Token_{}", rng.gen_range(1..=5));
            let rsi_val = rng.gen_range(30.0..=90.0);
            let price_val = rng.gen_range(10.0..=200.0);

            let rsi_entry = RSIData {
                token_address: token.clone(),
                rsi: rsi_val,
                timestamp: Utc::now().to_rfc3339(),
            };

            let trade_entry = TradeData {
                token_address: token,
                price_in_sol: price_val,
                timestamp: Utc::now().to_rfc3339(),
            };

            {
                let mut rsi_data = rsi_clone.lock().unwrap();
                rsi_data.push(rsi_entry);
                if rsi_data.len() > 10 {
                    rsi_data.remove(0);
                }
            }

            {
                let mut trade_data = trades_clone.lock().unwrap();
                trade_data.push(trade_entry);
                if trade_data.len() > 10 {
                    trade_data.remove(0);
                }
            }

            println!("📈 Generated new RSI + Trade data entry...");
            sleep(Duration::from_secs(3)).await;
        }
    });

    HttpServer::new(move || {
        let cors = Cors::permissive();
        App::new()
            .wrap(cors)
            .app_data(app_state.clone())
            .service(get_rsi)
            .service(get_trades)
    })
    .bind(("0.0.0.0", 8000))?
    .run()
    .await
}
