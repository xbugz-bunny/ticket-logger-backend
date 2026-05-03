"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const orgRoutes_1 = __importDefault(require("./routes/orgRoutes"));
const ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
const attendanceRoutes_1 = __importDefault(require("./routes/attendanceRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/org', orgRoutes_1.default);
app.use('/api/tickets', ticketRoutes_1.default);
app.use('/api/attendance', attendanceRoutes_1.default);
app.use('/api/messages', messageRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Ticket Logger API is running' });
});
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ticket_logger';
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});
