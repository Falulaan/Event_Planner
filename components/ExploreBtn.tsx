'use client'
import Image from "next/image"

const ExploreBtn = () => {
    return (
        <button type="button" id="explore-btn" className="mt-6 mx-auto max-w-3/4 hover:brightness-125"  onClick={()=> console.log('CLICK')}>
            <a href="/Events">
                Explore Events
                <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24}/>
            </a>
        </button>
    )
}
export default ExploreBtn
