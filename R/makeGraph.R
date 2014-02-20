makeGraph <- function(n,chance,popularity,age) {
	require(igraph)
	# chance acts on both parameters controlling 
	linearInterpolate <- function(value,min,max,range=c(0,100)) {
		interp <- approxfun(range,c(min,max))
		return(interp(value))
	}
	pa.exp <- linearInterpolate(((1-(chance/100))*(popularity/100)),0,1,c(0,100))
	aging.exp <- linearInterpolate(((1-(chance/100))*(popularity/100)),0,-5)
	g <- aging.prefatt.game(n, pa.exp, aging.exp, m = NULL, aging.bin = 300,
     out.dist = NULL, out.seq = NULL, out.pref = FALSE,
     directed = FALSE, zero.deg.appeal = 1, zero.age.appeal = 0,
     deg.coef = 1, age.coef = 1, time.window = NULL)
	return(g)
}