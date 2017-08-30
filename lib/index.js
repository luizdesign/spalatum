const http = require('http');
const url = require('url');

const fetchFragment = (uri) =>
    new Promise((resolve, reject) => {
        let response = '';
        let request = http.get(uri, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                response += chunk;
            });
            res.on('end', () => {
                let body = response.replace(/\/static/g, 'http://www.catho.com.br/static');

                return resolve(body);
            });
        });
        request.on('error', (error) => {
            console.log(error);
            reject(new Error(error));
        });
    });

const fragmentMapping = (template) =>
    new Promise((resolve, reject) => {
        try {
            let fragmentIdentifier = new RegExp(/<fragment[^>]+>/, 'gm');
            let fragmentUriIdentifier = new RegExp(/href=\"([^"]+)\"/);
            let fragments = template.match(fragmentIdentifier);

            resolve(fragments.map(async (fragment) => {
                let uri = fragment.match(fragmentUriIdentifier)[1];
                let content = await fetchFragment(uri);
                return {
                    'id': fragment,
                    'content': content
                };
            }));
        } catch (err) {
            reject(new Error(err));
        }
    });

const fragmentRender = (template, mapping) =>
    new Promise((resolve, reject) => {
        let loadedFragments = 0;
        mapping.forEach(async (map, index) => {
            let fetchMapping = await map;
            template = template.replace(
                `${fetchMapping.id}</fragment>`,
                fetchMapping.content
            );

            loadedFragments++;
            if (loadedFragments === mapping.length) {
                resolve(template);
            }
        });

    });

module.exports = (template) => fragmentMapping(template)
    .then((mapping) => fragmentRender(template, mapping));
