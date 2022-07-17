import express from 'express';
// import EventEmitter from 'events';


function serve(outdir: string): void {
  const HOST = process.env.HOST || 'localhost';
  const PORT = Number(process.env.PORT) || 3000;

  // const emiter = new EventEmitter();
  const Server = express();

  Server
    .use(express.static(outdir))
    // .get('/subscribe', (req, res) => {
    //   const headers = {
    //     'ContentType': 'text/event-stream',
    //     'Connection': 'keep-alive',
    //     'Cache-Control': 'no-cache',
    //   };
    //   res.writeHead(200, headers);
    //   res.write('');

    //   emiter.on('refresh', () => {
    //     res.write('data: message');
    //   })
    // })
    .listen(PORT, HOST, () => {
      console.log(`Server started on http://${HOST}:${PORT}`);
    })
  ;
}

export default serve;
