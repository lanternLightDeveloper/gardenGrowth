<footer>
	<p>
		Produced by <br />
		<a href="https://www.lanternlightdevelopment.com/">Lantern Light Development</a>
	</p>
</footer>

<style>
	footer {
		background-color: var(--bg-2);
		color: var(--txt-1);
		/* display: none; */
		display: flex;
		flex-direction: column;
		align-items: left;
		justify-content: left;
		width: 100vw;
		padding: 1rem;
		gap: 0.5rem;
		bottom: 0;
	}

	footer p {
		text-align: left;
		font-size: var(--size-4);
		margin: 0.5rem 0;
	}

	footer a {
		color: var(--hover-2);
		text-decoration: none;
	}

	footer a:hover {
		text-decoration: underline;
	}

	@media only screen and (min-width: 980px) {
		p {
			font-size: var(--size-4);
		}
	}
</style>
