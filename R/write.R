write <- function(to.r) {
	list(
		names = V(to.r$g)$names,
		links = to.r$links,
		game = to.r$results,
		score = to.r$results_score
		)
}