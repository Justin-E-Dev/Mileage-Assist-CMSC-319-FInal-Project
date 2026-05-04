from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
from datetime import datetime

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)
def get_db():
    conn = sqlite3.connect("clients.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_uid TEXT NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            program TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            user_uid TEXT NOT NULL,
            odometer_start TEXT,
            odometer_end TEXT,
            location_start TEXT,
            location_end TEXT,
            reason TEXT,
            date TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/clients", methods=["GET"])
def get_clients():
    user_uid = request.args.get("user_uid")
    conn = get_db()
    clients = conn.execute(
        "SELECT * FROM clients WHERE user_uid = ?", (user_uid,)
    ).fetchall()
    conn.close()
    return jsonify([dict(c) for c in clients])

@app.route("/clients", methods=["POST"])
def add_client():
    data = request.get_json()
    conn = get_db()
    conn.execute(
        "INSERT INTO clients (user_uid, first_name, last_name, program) VALUES (?, ?, ?, ?)",
        (data["user_uid"], data["first_name"], data["last_name"], data["program"])
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Client added!"})

@app.route("/visits", methods=["POST"])
def add_visit():
    data = request.get_json()
    date = datetime.now().strftime("%Y-%m-%d %H:%M")
    conn = get_db()
    conn.execute(
        "INSERT INTO visits (client_id, user_uid, odometer_start, odometer_end, location_start, location_end, reason, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (data["client_id"], data["user_uid"], data["odometer_start"], data["odometer_end"], data["location_start"], data["location_end"], data["reason"], date)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Visit saved!"})

@app.route("/visits", methods=["GET"])
def get_visits():
    user_uid = request.args.get("user_uid")
    conn = get_db()
    visits = conn.execute("""
        SELECT v.*, c.first_name, c.last_name, c.program 
        FROM visits v 
        JOIN clients c ON v.client_id = c.id 
        WHERE v.user_uid = ?
        ORDER BY v.date DESC
    """, (user_uid,)).fetchall()
    conn.close()
    return jsonify([dict(v) for v in visits])

@app.route("/spreadsheet")
def spreadsheet():
    return app.send_static_file("spreadsheet.html")


init_db()
if __name__ == "__main__":
    app.run(debug=True)