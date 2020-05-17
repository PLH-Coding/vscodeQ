window.acquireVsCodeApi = () => ({
    postMessage: (request) =>  {
        switch (request.body.action) {
            case 'read':
                window.postMessage({
                    request,
                    body: window.connectionListCommand,
                    success: true
                });
                break;
        }
    }
});

window.connectionListCommand = [{
        label: 'Qlik Local',
        settings: {
            username : 'user',
            password : 'qwertz',
            host     : '127.0.0.1',
            port     : '9076',
            secure   : false
        }
    }, {
        label: 'Qlik Local 2',
        settings: {
            username : '',
            password : '',
            host     : '127.0.0.1',
            port     : '9077',
            secure   : true,
            authorization: {
                strategy: 1,
                data: {
                    domain: "hannuschkar4fa4",
                    username: "qlik",
                    password: "qlik2020"
                }
            }
        }
    }];
