runGame <- function(g,nRuns) {
	require(igraph)
	game.results <- do.call(rbind,lapply(seq(1,nRuns), function(i){
        #print(i)
        g.mod <- g
        game.r <- list()
        # start by picking a random pair of nodes
        test.v <- sample(V(g.mod)$names,size=2)
        game.r$start.stop <- c()
        game.r$paths <- c()
        game.r$removed <- c()
        while(length(get.shortest.paths(g.mod,which(V(g.mod)$names==test.v[1]),which(V(g.mod)$names==test.v[2]))[[1]])>0) {
          #print(test.v)
          # you can still make the connection
          # record path 
          game.r$startstop <- c(game.r$start.stop,paste(test.v,collapse=" "))
          #print(c(test.v[1],test.v[2]))
          game.r$paths<-c(game.r$paths,
            paste(V(g.mod)$names[get.shortest.paths(g.mod,which(V(g.mod)$names==test.v[1]),which(V(g.mod)$names==test.v[2]))[[1]]],collapse=" "))
          # ATTACK THE NETWORK
          node.removed <- sample(V(g.mod)$names,size=1)
          game.r$removed <- c(game.r$removed,node.removed)
          g.mod=g.mod-which(V(g.mod)$names==node.removed)
          # check to see if one of the nodes of interest was removed
          if (node.removed == test.v[1] || node.removed == test.v[2]) {
            break
          }
          if (class(try(get.shortest.paths(g.mod,which(V(g.mod)$names==test.v[1]),which(V(g.mod)$names==test.v[2]))))=="try-error") {
            break
          }
          if (length(get.shortest.paths(g.mod,which(V(g.mod)$names==test.v[1]),which(V(g.mod)$names==test.v[2]))[[1]])==0) {
            break
          }
        }
        return(do.call(cbind,game.r))
      }))
	return(game.results)
}