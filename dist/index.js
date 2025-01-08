"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const systemConfig = __importStar(require("./config/system"));
const index_route_1 = __importDefault(require("./routes/client/index.route"));
const index_route_2 = __importDefault(require("./routes/admin/index.route"));
const databse = __importStar(require("./config/database"));
const bodyParser = require("body-parser");
const moment_1 = __importDefault(require("moment"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_flash_1 = __importDefault(require("express-flash"));
const path_1 = __importDefault(require("path"));
const method_override_1 = __importDefault(require("method-override"));
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
app.use(express_1.default.static(`${__dirname}/public`));
databse.connect();
app.use(express_1.default.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use('/tinymce', express_1.default.static(path_1.default.join(__dirname, 'node_modules', 'tinymce')));
require("./passport");
app.use((0, express_session_1.default)({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));
app.use((0, express_flash_1.default)());
app.use((0, method_override_1.default)('_method'));
app.locals.moment = moment_1.default;
app.locals.prefixAdmin = systemConfig.prefixAdmin;
(0, index_route_1.default)(app);
(0, index_route_2.default)(app);
app.get('*', (req, res) => {
    res.render('client/pages/errors/404', {
        title: '404 Not Found'
    });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`http://localhost:${port}/ ` + port);
});
