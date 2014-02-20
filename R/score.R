score <- function(results,nRuns) {
	# simplest thing I can think of average rounds network lasted. try this first
	return(sum(table(results[,1]))/nRuns)
}