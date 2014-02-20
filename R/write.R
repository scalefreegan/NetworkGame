write <- function(x) {
	list(
		names = V(x$g)$names,
		links = x$links,
		game = x$results,
		score = x$results_score
		)
}