bins = 20
xdim = length(seq(0,100,bins))
score.matrix = array(0,dim=c(101,101,101))
n = 100
nRuns = 100
for (x in seq(0,100,bins)) {
	print(x)
	for (y in seq(0,100,bins)) {
		for (z in seq(0,100,bins)) {
			g <- makeGraph(n,x,y,z)
			results <- runGame(g,nRuns)
			return(score(results,nRuns))
		}
	}
}