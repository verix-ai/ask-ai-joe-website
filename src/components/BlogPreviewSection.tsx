import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Real article data
const posts = [
  {
    title: "Could AI Help You Be a Better Neighbor?",
    date: "April 25, 2024",
    author: "Joe Finkelstein",
    excerpt: "It starts with a smile. A wave across the driveway. Maybe a casserole that's just slightly overcooked but delivered with the warmth of good intentions. Being a good neighbor is one of those timeless virtues that never goes out of style...",
    slug: "could-ai-help-you-be-a-better-neighbor",
  },
  {
    title: "AI vs. Procrastination: The Ultimate Showdown",
    date: "May 2, 2024",
    author: "Joe Finkelstein",
    excerpt: "Procrastination: that sneaky little monster that convinces you that reorganizing your sock drawer is more urgent than filing your taxes, writing that report or answering that email you've been dodging for three days...",
    slug: "ai-vs-procrastination",
  },
  {
    title: "When the Dead Speak: AI Brings New Voices to the Courtroom",
    date: "May 16, 2024",
    author: "Joe Finkelstein",
    excerpt: "A courtroom is a place for facts, evidence, and the rule of law—but it's also a stage for human emotion. Recently, a sentencing hearing took an unexpected and emotional turn when the sister of a murder victim used artificial intelligence...",
    slug: "when-the-dead-speak-ai-courtroom",
  },
];

const BlogPreviewSection: React.FC = () => {
  return (
    <section 
      id="blog" 
      className="py-16 md:py-24 bg-background animate-fade-in-up"
      style={{ animationDelay: '0.4s' }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest AI Columns
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights, updates, and demystifications from the world of AI, tailored for you.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Card 
              key={index} 
              className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300"
              // style={{ animationDelay: `${0.4 + index * 0.1}s` }} // Example for staggered card animation
            >
              <CardHeader>
                <CardTitle className="text-xl text-foreground leading-tight">{post.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">By {post.author} • {post.date}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm">{post.excerpt}</p>
              </CardContent>
              <CardFooter>
                <Link to={`/article/${post.slug}`}>
                  <Button variant="link" className="text-primaryBlue p-0 hover:text-blue-700">
                    Read More <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        {/* Optional: Link to a full blog page if it exists later */}
        {/* <div className="text-center mt-12">
          <Button variant="outline" className="border-primaryBlue text-primaryBlue hover:bg-primaryBlue/10">
            View All Articles
          </Button>
        </div> */}
      </div>
    </section>
  );
};

export default BlogPreviewSection;
