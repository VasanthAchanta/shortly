from flask import Flask, request, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import string
import random

app = Flask(__name__)
CORS(app)  # Add this line to enable CORS

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///urls.db'
db = SQLAlchemy(app)

class URL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(500), nullable=False)
    short_url = db.Column(db.String(10), unique=True, nullable=False)

def generate_short_url():
    characters = string.ascii_letters + string.digits
    short_url = ''.join(random.choice(characters) for _ in range(6))
    link = URL.query.filter_by(short_url=short_url).first()
    if link:
        return generate_short_url()
    return short_url

@app.route('/shorten', methods=['POST'])
def shorten_url():
    data = request.get_json()
    original_url = data['url']
    existing_url = URL.query.filter_by(original_url=original_url).first()
    if existing_url:
        return jsonify({'short_url': existing_url.short_url})
    short_url = generate_short_url()
    new_link = URL(original_url=original_url, short_url=short_url)
    db.session.add(new_link)
    db.session.commit()
    return jsonify({'short_url': short_url})

@app.route('/redirect', methods=['POST'])
def redirect_url():
    short_url = request.get_json()
    link = URL.query.filter_by(short_url=short_url['url']).first_or_404()
    return jsonify({'original_url': link.original_url})  

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)