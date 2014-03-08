writeJSON <- function(x) {
	list(
		names = x$names,
		links = as.data.frame(x$links),
		game = as.data.frame(x$results)
		)
}