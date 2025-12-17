async function getFeedback() {
	const res = await fetch("http://localhost:3000/api/feedback", {
		cache: "no-store",
	});
	return res.json();
}
type FeedbackItem = {
	id: string;
	message: string;
	createdAt: string;
};
export default async function AdminPage() {
	const feedback = await getFeedback();

	return (
		<main className='p-8 max-w-xl mx-auto'>
			<h1 className='text-2xl font-bold mb-4'>All Feedback</h1>

			<ul className='space-y-2'>
				{feedback.map((item: FeedbackItem) => (
					<li key={item.id} className='border p-2 rounded'>
						<p>{item.message}</p>
						<small className='text-gray-500'>
							{new Date(item.createdAt).toLocaleString()}
						</small>
					</li>
				))}
			</ul>
		</main>
	);
}
