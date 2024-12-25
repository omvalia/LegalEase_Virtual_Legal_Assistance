import warnings
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain.prompts import PromptTemplate
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import CTransformers
from langchain.chains import RetrievalQA
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import tensorflow as tf  # Import to control TensorFlow logs if needed

# Suppress specific warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

# Suppress TensorFlow logs if not needed
tf.get_logger().setLevel('ERROR')

DB_FAISS_PATH = 'vectorstore'

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Updated prompt template for legal assistant
custom_prompt_template = """You are a legal assistant. Provide helpful answers to law-based questions based on the context provided below.
If the information needed to answer is not in the context, just say 'I don't have enough information from the data to answer your question, Ask Law Based Questions'.

Context: {context}
Question: {question}

Only return the helpful answer below and nothing else.
Helpful answer:
"""

def set_custom_prompt():
    """
    Prompt template for QA retrieval for each vectorstore
    """
    prompt = PromptTemplate(template=custom_prompt_template,
                            input_variables=['context', 'question'])
    return prompt

# Retrieval QA Chain
def retrieval_qa_chain(llm, prompt, db):
    qa_chain = RetrievalQA.from_chain_type(llm=llm,
                                           chain_type='stuff',
                                           retriever=db.as_retriever(search_kwargs={'k': 2}),  # Retrieves top 2 relevant chunks
                                           return_source_documents=False,  # Not returning the source docs
                                           chain_type_kwargs={'prompt': prompt}
                                           )
    return qa_chain

# Loading the Llama model
def load_llm():
    llm = CTransformers(
        model="C:/Users/omvalia/Documents/chat_app_test/model/llama-2-7b-chat.ggmlv3.q8_0.bin",
        model_type="llama",
        max_new_tokens=512,
        temperature=0.3
    )
    return llm

# QA Model Function
def qa_bot():
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2",
                                       model_kwargs={'device': 'cpu'})
    db = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)
    llm = load_llm()
    qa_prompt = set_custom_prompt()
    qa = retrieval_qa_chain(llm, qa_prompt, db)

    return qa

# Output function with a check to ensure no duplicate responses
def final_result(query):
    qa_result = qa_bot()
    response = qa_result({'query': query})

    # Ensure the answer is clean and displayed only once
    final_answer = response['result'].strip()

    # Handling cases where no relevant context is found
    if "I don't have enough information from the data" in final_answer:
        final_answer = "I don't have enough information from the data to answer your question."

    # Return as JSON output
    result = {
        "question": query,
        "answer": final_answer
    }

    return json.dumps(result, indent=4)

# Flask route to handle POST requests for legal questions
@app.route('/ask-question', methods=['POST'])
def ask_question():
    data = request.get_json()
    question = data.get('question')

    if not question:
        return jsonify({"error": "No question provided"}), 400

    # Process the question and get the answer
    output = final_result(question)
    response = json.loads(output)

    # Print the response in the terminal
    print(json.dumps(response, indent=4))

    return jsonify(response), 200

# Main entry point for Flask app
if __name__ == '__main__':
    print("Starting Flask server for Legal Assistant...")
    app.run(host='0.0.0.0', port=5005)
