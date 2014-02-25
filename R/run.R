run <- function(n,chance,popularity,age,nRuns) {
	require(jsonlite)
	to.r <- list()
	to.r$g <- makeGraph(n,chance,popularity,age)
	to.r$names <- sapply(V(to.r$g)$names,toString)
	# convert graph into 
	makeAdjacencyMatrix <- function(graph){
    	val <- get.adjacency(graph=graph,sparse=F)
	    rownames(val) <- seq(1,dim(val)[1]); colnames(val) <- seq(1,dim(val)[2])

	    diag(val) <- 0
	    
	    #only consider the lower half of the matrix
	    val[upper.tri(val)] <- 0
	    
	    conns <- cbind(source=row(val)[val>0]-1, target=col(val)[val>0]-1, weight=val[val>0])
	    return(conns)
	}
	to.r$results <- runGame(to.r$g,nRuns)
	k0 = (mean(degree(to.r$g)^2)/mean(degree(to.r$g)))
	to.r$results_score <- 1-(1/(k0-1))
	# R. Cohen, K. Erez, D. ben-Avraham, S. Havlin Resilience of the Internet to random breakdowns Phys Rev Lett, 85 (2007), p. 4626
	to.r$links <- makeAdjacencyMatrix(to.r$g)
	# writeToJSON <- function(x,filename) {
	# 	towrite <- list(
	# 		names = x$names,
	# 		links = as.data.frame(x$links),
	# 		game = as.data.frame(x$results),
	# 		score = x$results_score
	# 		)
	# 	towrite <- toJSON(towrite, pretty=TRUE)
	# 	write(towrite,file=filename)
	# }
	# writeToJSON(to.r,"~/Desktop/graph.json")
	return(to.r)
}