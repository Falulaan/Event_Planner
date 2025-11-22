const events = [
    {
        title: 'Marine Expo',
        description: "Join world leading engineering",
        image: '/images/marine-expo.webp',
    },
    {
        title: 'Military Expo',
        description: "Learn more about here.",
        image: '/images/military-expo.jpg',
    },
    {
        title: 'Food Expo',
        description: "Learn more about here.",
        image: '/images/food-expo.jpg',
    },
    {
        title: 'Science Expo',
        description: "Learn more about here.",
        image: '/images/science-expo.jpg',
    }
]


const Page = () => {
    return (
        <div>
            <h3>Events</h3>


            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  mt-1'>
                {events.map((event, index) => (
                    <div key={index} className='border rounded-lg shadow-sm p-4  bg-white/9 hover:text-cyan-500 hover:border-cyan-500 hover:brightness-110'>
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-40 object-cover rounded-md mb-2"
                        />
                        <h4 className='text-lg font-bold'>{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                ))}

            </div>
        </div>
    )
}
export default Page
