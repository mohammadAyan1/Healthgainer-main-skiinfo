"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState,use } from "react";

const blogData = [
  {
    id: 1,
    images: [
      "https://cdn.pixabay.com/photo/2019/11/07/05/07/exercise-4607682_1280.jpg",
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFjayUyMGV4ZXJjaXNlc3xlbnwwfHwwfHx8MA%3D%3D"
    ],
    category: "TOP 10 EASY BACK EXERCISES",
    title: "Top 10 Easy Back Exercises for Gym",
    date: "JANUARY 09, 2025",
    author: "Dr. Sarah Johnson",
    authorImage: "https://randomuser.me/api/portraits/women/44.jpg",
    content: [
      {
        type: "paragraph",
        text: "A strong back is essential for good posture, injury prevention, and overall strength. These top 10 back exercises are designed to help you strengthen your core and back muscles effectively."
      },
      {
        type: "heading",
        text: "1. Pull-ups"
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFjayUyMGV4ZXJjaXNlc3xlbnwwfHwwfHx8MA%3D%3D",
        alt: "Pull-up exercise"
      },
      {
        type: "paragraph",
        text: "Great for upper back and shoulders. Start with 3 sets of 8-10 reps. Use an assisted pull-up machine if needed."
      },
      {
        type: "heading",
        text: "2. Deadlifts"
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGVhZGxpZnR8ZW58MHx8MHx8fDA%3D",
        alt: "Deadlift exercise"
      },
      {
        type: "paragraph",
        text: "Strengthens lower back and core. Maintain proper form to avoid injury. Recommended: 4 sets of 6-8 reps with moderate weight."
      },
      {
        type: "tip",
        text: "Always warm up for 5-10 minutes before starting these exercises to prevent injuries."
      }
    ]
  },
  {
    id: 2,
    images: [
      "https://images.unsplash.com/photo-1521986329282-0436c1f1e212?q=80&w=1476&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMHBob3RvZ3JhcGh5fGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZvb2QlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHx8MA%3D%3D"
    ],
    category: "TOP 10 VITAMIN C RICH FOODS",
    title: "Top 10 Vitamin C Rich Foods",
    date: "DECEMBER 27, 2024",
    author: "Dr. Michael Chen",
    authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
    content: [
      {
        type: "paragraph",
        text: "Vitamin C is essential for a strong immune system, glowing skin, and healthy metabolism. These top 10 foods will help you stay healthy and fit."
      },
      {
        type: "heading",
        text: "1. Oranges"
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b3Jhbmdlc3xlbnwwfHwwfHx8MA%3D%3D",
        alt: "Oranges"
      },
      {
        type: "paragraph",
        text: "The best natural Vitamin C source. One medium orange provides about 70mg of Vitamin C, which is 78% of the Daily Value (DV)."
      },
      {
        type: "heading",
        text: "2. Bell Peppers"
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1564821792184-0451b2e833c0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVsbCUyMHBlcHBlcnN8ZW58MHx8MHx8fDA%3D",
        alt: "Bell peppers"
      },
      {
        type: "paragraph",
        text: "Red bell peppers contain 152mg of Vitamin C per 100g (169% DV). They're also a great source of vitamin A and antioxidants."
      },
      {
        type: "tip",
        text: "Vitamin C is water-soluble and sensitive to heat, so eat these foods raw or lightly cooked to preserve nutrients."
      }
    ]
  }
];

export default function BlogDetail({ params }) {
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const unwrappedParams = use(params);
  const id = parseInt(unwrappedParams.id);

  useEffect(() => {
    const foundBlog = blogData.find((b) => b.id === id);
    if (foundBlog) setBlog(foundBlog);
    else router.push("/404");
  }, [id, router]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === blog.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? blog.images.length - 1 : prev - 1
    );
  };

  if (!blog) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-gray-50"
    >
      <div className="relative w-full h-[60vh] bg-gray-900 overflow-hidden">
        {blog.images.map((img, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: idx === currentImageIndex ? 1 : 0,
              zIndex: idx === currentImageIndex ? 10 : 0
            }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={img}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-6">
              <h1 className="text-4xl md:text-5xl font-bold">{blog.title}</h1>
              <p className="text-lg mt-2">{blog.date}</p>
              <p className="text-sm uppercase tracking-wide mt-4 bg-primary px-4 py-1 rounded">
                {blog.category}
              </p>
            </div>
          </motion.div>
        ))}

        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 p-3 rounded-full backdrop-blur-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 p-3 rounded-full backdrop-blur-sm transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {blog.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="flex items-center gap-4 mb-8">
          <img
            src={blog.authorImage}
            alt={blog.author}
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{blog.author}</p>
            <p className="text-gray-500 text-sm">Fitness Expert</p>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Blogs
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="prose max-w-none"
        >
          {blog.content.map((section, index) => {
            switch (section.type) {
              case "heading":
                return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-800">{section.text}</h2>;
              case "paragraph":
                return <p key={index} className="text-gray-700 leading-relaxed mb-6">{section.text}</p>;
              case "image":
                return (
                  <div key={index} className="my-8 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={section.src}
                      alt={section.alt}
                      width={800}
                      height={500}
                      className="w-full h-96 object-cover"
                    />
                    <p className="text-center text-sm text-gray-500 mt-2">{section.alt}</p>
                  </div>
                );
              case "tip":
                return (
                  <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded">
                    <p className="font-semibold text-blue-800">💡 Pro Tip:</p>
                    <p className="text-blue-700">{section.text}</p>
                  </div>
                );
              default:
                return null;
            }
          })}
        </motion.div>

        <div className="mt-12 border-t pt-8">
          <h3 className="text-lg font-semibold mb-4">Share this article</h3>
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Facebook
            </button>
            <button className="bg-blue-400 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
              Twitter
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">You might also like</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogData
              .filter((b) => b.id !== blog.id)
              .map((relatedBlog) => (
                <motion.div
                  key={relatedBlog.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/blog/${relatedBlog.id}`)}
                >
                  <div className="relative h-48">
                    <img
                      src={relatedBlog.images[0]}
                      alt={relatedBlog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-2">
                      {relatedBlog.category}
                    </span>
                    <h3 className="text-xl font-semibold mb-2">{relatedBlog.title}</h3>
                    <p className="text-sm text-gray-500">{relatedBlog.date}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}