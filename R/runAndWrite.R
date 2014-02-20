runAndWrite <- function(n,chance,popularity,age,nRuns) {
	g <- makeGraph(n,chance,popularity,age)
	results <- runGame(g,nRuns)
	score.matrix[index,]=c(x,y,z,score(results,nRuns))
}