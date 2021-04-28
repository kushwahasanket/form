var jwt = require('jsonwebtoken')
var express = require('express')
var mongoose = require('mongoose');
var Login = require('../model/db');
module.exports = {

    auth :(req,res)=>{
        Login.findOne()
    }
}