<script>
	import Hero from '$lib/Images/04182026-1.jpg';
	import Test from '$lib/Images/04182026-4.jpg';
	import Test2 from '$lib/Images/04182026-2.jpg';
</script>

<section class="hero">
	<h1>Garden Growth</h1>
	<img src={Hero} alt="Seed packets laid out around a garden space" />
</section>

<main>
	<section class="LastWeek">
		<h2>Last week in our gardens growth</h2>
		<p>
			We planted the seeds and set up a few flowers. We also brought a few plant's from the front
			yard
		</p>
	</section>

	<section class="Highlighter">
		<img src={Test} alt="" />
	</section>

	<section class="carousel">
		<img src={Test2} alt="" />
	</section>

	<section class="Weather">
		<h3>Weather this week:</h3>
	</section>

	<section class="PlantPlans">
		<h3>This week:</h3>
		<p>
			We are keeping weeds away and watching for anything to run out of the ground first. Netted the
			strawberries.
		</p>
	</section>

	<section class="LessonLearned">
		<h4>Lesson Learned</h4>
		<p>Thing's we read or watched:</p>
		<ul>
			<li>Link to something about bugs and flowers or plants to help deter them</li>
		</ul>
	</section>
</main>

<style>
	.hero {
		position: relative;
		height: 80vh;
		display: flex;
		align-items: flex-end;
		justify-content: flex-start;
		overflow: hidden;
	}

	.hero img {
		position: absolute;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: brightness(0.7);
	}

	.hero h1 {
		position: relative;
		margin: 2rem;
		font-size: clamp(2rem, 4vw, 3.5rem);
		letter-spacing: 0.05em;
		z-index: 50;
	}

	main {
		max-width: 900px;
		margin: -3rem auto 3rem;
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	section {
		background: var(--bg-2);
		border-radius: 1.5rem;
		padding: 1.5rem;
	}

	img {
		transition: transform 0.3s ease;
	}

	/* img:hover {
		transform: scale(1.03);
	} */

	section {
		animation: fadeUp 0.6s ease both;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.LastWeek h2 {
		margin-top: 0;
		font-size: 1.5rem;
	}

	.Highlighter {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		padding: 0.5rem;
	}

	.Highlighter img {
		width: 100%;
		height: 120px;
		object-fit: cover;
		border-radius: 1rem;
	}

	.carousel {
		display: flex;
		gap: 0.75rem;
		overflow-x: auto;
		padding-bottom: 0.5rem;
	}

	.carousel img {
		height: 140px;
		border-radius: 1rem;
		object-fit: cover;
		flex-shrink: 0;
	}

	.Weather {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.LessonLearned {
		border-left: var(--border);
	}

	.LessonLearned h4 {
		margin-top: 0;
	}
</style>
