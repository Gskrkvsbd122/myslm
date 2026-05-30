/**
 * TOY TRANSFORMER INFERENCE ENGINE
 * Architecture: Embedding -> Self-Attention -> Feed-Forward -> Linear
 */

class MathUtils {
    // Generate random matrix (simulating untrained weights)
    static randomMatrix(rows, cols) {
        return Array.from({ length: rows }, () => 
            Array.from({ length: cols }, () => (Math.random() * 2 - 1) * 0.1)
        );
    }

    // Dot product for 1D arrays
    static dot(a, b) {
        return a.reduce((sum, val, i) => sum + val * b[i], 0);
    }

    // Matrix Multiplication (2D x 2D)
    static matmul(A, B) {
        const rowsA = A.length, colsA = A[0].length;
        const colsB = B[0].length;
        let result = Array.from({ length: rowsA }, () => Array(colsB).fill(0));
        for (let i = 0; i < rowsA; i++) {
            for (let j = 0; j < colsB; j++) {
                for (let k = 0; k < colsA; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        return result;
    }

    // Softmax for a 1D array
    static softmax(arr) {
        const max = Math.max(...arr);
        const exps = arr.map(x => Math.exp(x - max));
        const sumExps = exps.reduce((a, b) => a + b, 0);
        return exps.map(x => x / sumExps);
    }
}

class ToyTransformer {
    constructor(vocabSize = 256, dModel = 16) {
        this.vocabSize = vocabSize;
        this.dModel = dModel;
        
        // Initialize Random Weights
        this.Wq = MathUtils.randomMatrix(dModel, dModel);
        this.Wk = MathUtils.randomMatrix(dModel, dModel);
        this.Wv = MathUtils.randomMatrix(dModel, dModel);
        this.Wo = MathUtils.randomMatrix(dModel, vocabSize); // Output logits
        this.embeddings = MathUtils.randomMatrix(vocabSize, dModel);
    }

    // A highly simplified single-head self-attention mechanism
    selfAttention(seqEmbeddings) {
        const Q = MathUtils.matmul(seqEmbeddings, this.Wq);
        const K = MathUtils.matmul(seqEmbeddings, this.Wk);
        const V = MathUtils.matmul(seqEmbeddings, this.Wv);

        // Q * K^T
        const K_T = K[0].map((_, colIndex) => K.map(row => row[colIndex]));
        const scores = MathUtils.matmul(Q, K_T);
        
        // Scale and Softmax
        const scale = Math.sqrt(this.dModel);
        const attentionWeights = scores.map(row => MathUtils.softmax(row.map(v => v / scale)));
        
        // Multiply by V
        return MathUtils.matmul(attentionWeights, V);
    }

    // Inference step (character by character for demo)
    generate(inputText, maxTokens = 10) {
        let output = "";
        
        // Simulating sequence generation
        for (let step = 0; step < maxTokens; step++) {
            // Tokenize (using char codes as toy tokens)
            const tokens = inputText.split('').map(c => c.charCodeAt(0) % this.vocabSize);
            
            // Embed
            const seqEmbeddings = tokens.map(t => this.embeddings[t]);
            
            // Transformer Block
            const attentionOutput = this.selfAttention(seqEmbeddings);
            
            // Output Layer (Logits)
            const logits = MathUtils.matmul(attentionOutput, this.Wo);
            
            // Get last token prediction
            const lastLogit = logits[logits.length - 1];
            const probs = MathUtils.softmax(lastLogit);
            
            // Argmax (Greedy Decoding)
            const nextTokenId = probs.indexOf(Math.max(...probs));
            const nextChar = String.fromCharCode(nextTokenId > 31 ? nextTokenId : 32); // avoid non-printable chars
            
            output += nextChar;
            inputText += nextChar; // append for next autoregressive step
        }
        
        return output;
    }
}
