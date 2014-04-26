run <- function(n,chance,popularity,age,nRuns,uName,breaks) {
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
	# i think max score should be < n. subtracting from n will flip the score
	to.r$results_score2 <- (((n-1)*(n-2)/2)-(1/(n-1))*(sum(max(to.r$betweeness)-to.r$betweeness)))/((n-1)*(n-2)/2)
	# L.C. Freeman. A set of measures of centrality based on betweenness. Sociometry, 40 (1) (1977), pp. 35–41
	
	to.r$links <- makeAdjacencyMatrix(to.r$g)
	#to.r$graph.tor <- paste(paste(to.r$links[,1],to.r$links[,2],sep=","),collapse=";")
	to.r$graph.tor <- ""
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
		} else{
			dbCommit(con)
			
	}
	lapply(dbListConnections(drv),function(i)dbDisconnect(i))
	dbUnloadDriver(drv)
	# dbGetQuery(con,"select * from networks")
	# dbListFields(con,"networks")
	# data for graph1
	
	# data for graph2
	to.r$degree <- compileBasicStatsHist("degree_dist",by="score_1",hist=F,n=n)
	to.r$betweenness <- compileBasicStatsHist("betweenness",by="score_1",hist=T,bins=breaks,n=n)
	# data for graph3
	to.r$g3data <- getAll("network_id,user_name,score_1,score_2,chance_val,popularity_val,age_val",n=n)[[1]]
	if (to.r$g3data[dim(to.r$g3data)[1],"score_1"]>sort(getAll("score_1",n=150)[[1]][,1],decreasing=T)[10]) {
		to.r$is_high = T
	} else {
		to.r$is_high = F
	}
	if (dim(to.r$g3data)[1]>100) {
		highInd = which(to.r$g3data[,"score_1"]==max(to.r$g3data[,"score_1"]))
		lowInd = which(to.r$g3data[,"score_1"]==min(to.r$g3data[,"score_1"]))
		sampledInd = sample(seq(1,dim(to.r$g3data)[1]),100)
		to.r$g3data = to.r$g3data[sort(unique(c(highInd,lowInd,sampledInd,dim(to.r$g3data)[1]))),]
	}
	# writeToJSON <- function(x,filename) {
	# 	towrite <- list(
	# 					names = x$names,
	# 					links = as.data.frame(x$links),
	# 					game = as.data.frame(x$results),
	# 					degree = x$degree,
	# 					betweenness = x$betweenness,
	# 					other_data = as.data.frame(x$g3data),
	# 					is_high = x$is_high
	# 					)
	# 	towrite <- toJSON(towrite, pretty=TRUE)
	# 	write(towrite,file=filename)
	# }
	# writeToJSON(to.r,"graph_small.json")
	return(to.r)
}