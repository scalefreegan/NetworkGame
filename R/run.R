run <- function(n,chance,popularity,age,nRuns,uName) {
	require(jsonlite)
	require(RPostgreSQL)
	to.r <- list()
	to.r$g <- makeGraph(n,chance,popularity,age)
	to.r$degree <- degree(to.r$g)
	to.r$betweeness <- betweenness(to.r$g)
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
	to.r$results_score1 <- 1-(1/(k0-1))
	# R. Cohen, K. Erez, D. ben-Avraham, S. Havlin Resilience of the Internet to random breakdowns Phys Rev Lett, 85 (2007), p. 4626
	to.r$results_score2 <- 1/((1/(length(to.r$names)-1))*(sum(max(to.r$betweeness)-to.r$betweeness)))
	# L.C. Freeman. A set of measures of centrality based on betweenness. Sociometry, 40 (1) (1977), pp. 35–41
	to.r$links <- makeAdjacencyMatrix(to.r$g)
	to.r$graph.tor <- paste(paste(to.r$links[,1],tmp$links[,2],sep=","),collapse=";")

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
	# connect and write to database
	drv <- dbDriver("PostgreSQL")
	con <- dbConnect(drv, dbname="nihnetworks")
	formatted_vals = paste(paste("'",uName,"'",sep=""),n,chance,popularity,age,to.r$results_score1,
		to.r$results_score2,paste("'",paste(to.r$degree,collapse=","),"'",sep=""),
		paste("'",paste(to.r$betweeness,collapse=","),"'",sep=""),
		paste("'",to.r$graph.tor,"'",sep=""),sep=",")
	#formatted_vals = "'ab',25,1,2,3,1,2,'1,2','1,2','1,2'"
	dbGetQuery(con, "BEGIN TRANSACTION")
		rs <- dbSendQuery(con,
			paste("Insert into networks (user_name,n_node,chance_val,popularity_val,age_val,score_1,score_2,degree_dist,betweenness,network) values (",formatted_vals,")",sep=""))
		if(dbGetInfo(rs, what = "rowsAffected") > 1){
			warning("Rolling back transaction")
			dbRollback(con)
		}else{
			dbCommit(con)
	}
	dbDisconnect(con)
	# dbGetQuery(con,"select * from networks")
	# dbListFields(con,"networks")
	return(to.r)
}