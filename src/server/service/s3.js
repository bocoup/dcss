const { Router } = require('express');
const AWS = require('aws-sdk');
require('dotenv').config();


const s3 = new AWS.S3();
const s3Params = {
    Bucket: process.env.S3_BUCKET
}

const s3Router = Router();

/**
 *  This is a stubbed endpoint in which the user can
 *  request a given file key, and the endpoint returns
 *  the content if it is a string and 'ok' if it doesn't
 *  exist.
 */
s3Router.get('/:key', (req, res) => {
    const params = { ...s3Params, Key: req.params.key};
    s3.getObject(params, (err, data) => {
        if (data && (data.ContentType === 'binary/octet-stream' || data.ContentType === 'application/octet-stream')) {
            res.send(data.Body.toString());
        } else {
            res.send('ok');
        }
    });
});

/**
 *  This is a stubbed endpoint in which the user can
 *  send a POST request for a given file key, and the
 *  endpoint writes the URL to a text file in s3.
 */
s3Router.post('/:key', async (req, res, next) => {
    let params = { ...s3Params, Key: req.params.key};
    const body = req.originalUrl;
    params['Body'] = Buffer.from(body);
    await s3.putObject(params, (err, data) => {
        // pass the error to Express if there is one
        if (err) next(err);
        res.send('ok');
    });
});
    

module.exports = s3Router;
