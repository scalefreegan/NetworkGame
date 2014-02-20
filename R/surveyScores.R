bins = 20
xdim = length(seq(0,100,bins))
score.matrix = array(0,dim=c((xdim*xdim*xdim),4))
n = 1000
nRuns = 100
index = 1
for (x in seq(0,100,bins)) {
	print(x)
	for (y in seq(0,100,bins)) {
		for (z in seq(0,100,bins)) {
			g <- makeGraph(n,x,y,z)
			results <- runGame(g,nRuns)
			score.matrix[index,]=c(x,y,z,score(results,nRuns))
			index = index+1
		}
	}
}

require(ggplot2)