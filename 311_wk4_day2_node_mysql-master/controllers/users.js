const mysql = require('mysql')
const pool = require('../sql/connection')
const { handleSQLError } = require('../sql/error')

function get_users(req, res){
  pool.query('SELECT * FROM users',
  function(err, rows){
      if(err){
          return res.json({
              'error': true,
              'message': 'Error occured:' + err
          })
      } else {
          res.json(rows)
      }
  })
}

function get_first_names(req, res){
  let sql = 'SELECT ??, ?? FROM ?? WHERE ?? < ??'
  const replacements = ['id', 'first_name', 'users', 'id', 10]
  sql = mysql.format(sql, replacements)
  pool.query(sql, function(err, rows){
      if(err){
          return res.json({
              'error': true,
              'message': 'Error occured:' + err
          })
      } else {
          res.json(rows)
      }
  })
}

function getUserByID(req, res){
  let userId = req.params.id
  let sql = 'SELECT ??, ?? FROM ?? WHERE ?? = ?'
  const replacements = ['id', 'first_name', 'users', 'id', userId]
  sql = mysql.format(sql, replacements)
  pool.query(sql, function(err, rows){
      if(err){
          return res.json({
              'error': true,
              'message': 'Error occured:' + err
          })
      } else {
          res.json(rows)
      }
  })
}

const createUser = (req, res) => {
  // INSERT INTO USERS FIRST AND LAST NAME 
  let first = req.params.first_name
  let last = req.params.last_name
  let sql = "INSERT INTO USERS(first_name, last_name) VALUES (?, ?)"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [first, last])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ newId: results.insertId });
  })
}

const updateUserById = (req, res) => {
  // UPDATE USERS AND SET FIRST AND LAST NAME WHERE ID = <REQ PARAMS ID>
  let id = req.params.id
  let first = req.params.first_name
  let last = req.params.last_name

  let sql = "UPDATE users SET ID = ?, first_name = ?, last_name = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [id, first, last])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.status(204).json();
  })
}

const deleteUserByFirstName = (req, res) => {
  // DELETE FROM USERS WHERE FIRST NAME = <REQ PARAMS FIRST_NAME>
  let id = req.params.id;
  let sql = "DELETE FROM users WHERE id = ?"
  // WHAT GOES IN THE BRACKETS
  sql = mysql.format(sql, [id])

  pool.query(sql, (err, results) => {
    if (err) return handleSQLError(res, err)
    return res.json({ message: `Deleted ${results.affectedRows} user(s)` });
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName
}