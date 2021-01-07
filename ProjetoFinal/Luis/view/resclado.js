var fs = require('fs') 
    
      /*app.use(function(req, res, next){ 
     
 
     
 
       jwt.verify(req.query.token, 'PRI2020', function(e, payload){ 
     
 
     
 
       if(e) res.status(401).jsonp({error: 'Erro na verificação do token: ' + e}) 
     
 
     
 
       else{ 
     
 
     
 
       req.user = { level: payload.level, username: payload.username } 
     
 
     
 
       next() 
     
 
     
 
       }  
     
 
     
 
       }) 
     
 
     
 
      })*/ 
     
 
     
 
     
 
      app.use( function (req, res, next){ 
     
 
     
 
        
      var 
       publicKey = fs.readFileSync( 
      './keys/pubkey.pem' 
      ) 
     
 
     
 
       jwt.verify(req.query.token, publicKey,{ algorithms: [ 
      'RS256' 
      ] },  
      function 
      (e, payload){ 
     
 
     
 
        
      if 
      (e) res.status( 
      401 
      ).jsonp({error:  
      'Erro na verificação do token: ' 
       + e}) 
     
 
     
 
        
      else 
      { 
     
 
     
 
       req.user = { level: payload.level, username: payload.username } 
     
 
     
 
       next() 
     
 
     
 
       }  
     
 
     
 
       }) 
     
 
     
 
      }) 
     
 
    
 

 
    
 
     var 
      fs = require( 
     'fs' 
     ) 
    
 
    
 
     
 
      router.post( 
      '/keys' 
      ,  
      function 
      (req, res){ 
     
 
     
 
        
      var 
       privateKey = fs.readFileSync(__dirname +  
      '/../keys/mykey.pem' 
      ) 
     
 
     
 
       jwt.sign({ username: user.username, level: user.level, sub:  
      'aula de PRI2020' 
      },  
     
 
     
 
       privateKey, 
     
 
     
 
       { algorithm:  
      'RS256' 
       }, 
     
 
     
 
        
      function 
      (e, token) { 
     
 
     
 
        
      if 
      (e) res.status( 
      500 
      ).jsonp({error:  
      "Erro na geração do token: " 
       + e})  
     
 
     
 
        
      else 
       res.status( 
      201 
      ).jsonp({token: token}) 
     
 
     
 
       }); 
     
 
     
 
      }) 
     