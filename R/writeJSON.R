writeJSON <- function(x) {
	list(
		names = x$names,
		links = as.data.frame(x$links),
		game = x$results,
		score = x$results_score
		)
}