"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const groupRoute_1 = __importDefault(require("./routes/groupRoute"));
const expenseRoute_1 = __importDefault(require("./routes/expenseRoute"));
const settlementRoute_1 = __importDefault(require("./routes/settlementRoute"));
const PORT = process.env.PORT || 5000;
app.use('/api/auth', authRoute_1.default);
app.use('/api/groups', groupRoute_1.default);
app.use('/api/expenses', expenseRoute_1.default);
app.use('/api/settlements', settlementRoute_1.default);
app.get('/', (req, res) => {
    res.send('Smart Expense Splitter API is running');
});
const startServer = async () => {
    try {
        if (process.env.MONGO_URI) {
            await mongoose_1.default.connect(process.env.MONGO_URI);
            console.log('Connected to MongoDB');
        }
        else {
            console.warn('MONGO_URI not provided. Skipping db connection.');
        }
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start the server', error);
    }
};
startServer();
//# sourceMappingURL=index.js.map