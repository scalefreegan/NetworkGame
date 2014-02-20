makeGraph <- function(n,chance,popularity,age) {
	require(igraph)
	# chance acts on both parameters controlling 
	linearInterpolate <- function(value,min,max,range=c(0,100)) {
		interp <- approxfun(range,c(min,max))
		return(interp(value))
	}
	pa <- linearInterpolate(((1-(chance/100))*(popularity/100)),0,1,c(0,100))
	aging <- linearInterpolate(((1-(chance/100))*(popularity/100)),0,-5)
	g <- aging.prefatt.game(n, pa.exp=pa,aging.exp=aging,directed=F)
	V(g)$names <- seq(0,length(V(g))-1)
	return(g)
}