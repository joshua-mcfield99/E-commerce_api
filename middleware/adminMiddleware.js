const jwt = require('jsonwebtoken');
const pool = require('../database_sql/pool');

const checkAdminRole = async (req, res, next) => {
    try {
        const token = req.header
    }
};