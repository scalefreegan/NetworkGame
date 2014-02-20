run <- function(n,chance,popularity,age,nRuns) {
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
	to.r$results_score <- score(to.r$results,nRuns)
	to.r$links <- makeAdjacencyMatrix(to.r$g)
	return(to.r)
}