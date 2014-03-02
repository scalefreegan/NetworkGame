# common database queries

getHigh <- function(what,by) {
	drv <- dbDriver("PostgreSQL")
	con <- dbConnect(drv, dbname="nihnetworks")
	query = paste("select ", what, " from networks where ", by, " = (select max(", by ,") from networks)",sep="")
	return(dbGetQuery(con,query))
}

