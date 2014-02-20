runAndWrite <- function(n,chance,popularity,age,nRuns) {
	g <- makeGraph(n,chance,popularity,age)
	results <- runGame(g,nRuns)
	results_score <- score(results,nRuns)
	return(results_score)
}