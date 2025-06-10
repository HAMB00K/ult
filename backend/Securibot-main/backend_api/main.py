#Application entry point so that we can run it 
# We have to add the blueprints to the app
from flask import Flask
from flask_cors import CORS
app = Flask(__name__)   # __name__ is the name of the current module    

from flask_cors import CORS



from blueprints.prompt_generation import mistral_bp
from blueprints.convo_bp import convo_bp

app.register_blueprint(mistral_bp)
app.register_blueprint(convo_bp)


# Apply CORS to each blueprint BEFORE registering them
CORS(convo_bp, origins=["http://localhost:9002", "http://127.0.0.1:9002"], supports_credentials=True)
CORS(mistral_bp, origins=["http://localhost:9002", "http://127.0.0.1:9002"], supports_credentials=True)





if __name__ == '__main__':
    app.run(debug=True)