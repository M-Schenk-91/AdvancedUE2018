function main () {
    console.log("start");

	var twitter = twitterReceiever();
	twitter.loadFeeds("realDonaldTrump&SPORTBILD&GrumpyMerkel&SPIEGELONLINE");
}

main();

