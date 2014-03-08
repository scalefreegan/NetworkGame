# common database queries

getHigh <- function(what,by) {
	require(RPostgreSQL)
	drv <- dbDriver("PostgreSQL")
	con <- dbConnect(drv, dbname="nihnetworks")
	query <- paste("select ", what, " from networks where ", by, " = (select max(", by ,") from networks)",sep="")
	result <- dbGetQuery(con,query)
	dbDisconnect(con)
	return(list(result))
}

getAll <- function(what) {
	require(RPostgreSQL)
	drv <- dbDriver("PostgreSQL")
	con <- dbConnect(drv, dbname="nihnetworks")
	query <- paste("select ", what, " from networks",sep="")
	result <- dbGetQuery(con,query)
	dbDisconnect(con)
	return(list(result))
}

scaleData <- function(x,x_range=10) {
	(x-min(x))*(x_range/max(x-min(x)))
}

compileBasicStats <- function(what,yours){
		# compile all vs your score for a measure
		# format for JSON and plotting in nvd3
		options(stringsAsFactors=FALSE)
		data = getAll(what)[[1]][,1]
		data_scaled = scaleData(c(data,yours),breaks)
		all = hist(data_scaled[1:length(data)],breaks-1)
		all = cbind(all$breaks,all$density); colnames(all) <- c("x","y")
		all = data.frame(all)
		yours <- list(data.frame(x=data_scaled[length(data_scaled)],y=max(all$y)))
		x <- data.frame(key = c("All", "User"))
		x$values = list(all,yours)
		return(x)
}

