import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MaterialIcon } from "@/lib/icons";

const Home: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex flex-col">
      <div className="container mx-auto px-4 py-16 text-center flex-grow">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Jiffy
        </h1>
        <p className="text-center text-[1.35rem] leading-relaxed text-gray-700 mb-8">
          <span className="font-semibold">
            Accelerate Spring Boot microservice development
          </span>{" "}
          with modern tooling,
          <br />
          reusable prototypes, and{" "}
          <span className="font-semibold">
            industry-standard best practices
          </span>
          .
        </p>

        <Button
          onClick={() => setLocation("/generator")}
          className="px-6 py-3 text-lg bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg transition-all"
        >
          <MaterialIcon name="add" className="w-5 h-5 mr-2" />
          Create Project
        </Button>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-8">Why Jiffy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-sm text-center">
              <MaterialIcon
                name="rapid_dev"
                className="w-8 h-8 text-primary mx-auto mb-4"
              />
              <h3 className="text-lg font-medium mb-2">Rapid Development</h3>
              <p className="text-gray-600">
                Generate production-ready Spring Boot applications in minutes,
                not hours. Complete with front-end and REST API.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm text-center">
              <MaterialIcon
                name="slider"
                className="w-8 h-8 text-primary mx-auto mb-4"
              />
              <h3 className="text-lg font-medium mb-2">Best Practices</h3>
              <p className="text-gray-600">
                Built in industry standards with modern architectural patterns.
                Along DbInit, Security, Documentation, and more.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm text-center">
              <MaterialIcon
                name="customize"
                className="w-8 h-8 text-primary mx-auto mb-4"
              />
              <h3 className="text-lg font-medium mb-2">Customizable</h3>
              <p className="text-gray-600">
                Easily extend and customize your application with modular
                components. Only generate the code you really need.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="p-6 bg-white rounded-lg shadow-sm text-center">
              <MaterialIcon
                name="quality"
                className="w-8 h-8 text-primary mx-auto mb-4"
              />
              <h3 className="text-lg font-medium mb-2">Code Quality</h3>
              <p className="text-gray-600">
                Clean, maintainable code with unique separation of concerns.
                Follows Spring Boot conventions and best practices.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm text-center">
              <MaterialIcon
                name="micro"
                className="w-8 h-8 text-primary mx-auto mb-4"
              />
              <h3 className="text-lg font-medium mb-2">Microservice Ready</h3>
              <p className="text-gray-600">
                Built to support microservice architecture with configurations
                for service discovery, load balancing and distributed tracing.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-sm text-center">
              <MaterialIcon
                name="autorenew"
                className="w-8 h-8 text-primary mx-auto mb-4"
              />
              <h3 className="text-lg font-medium mb-2">DevOps Integration</h3>
              <p className="text-gray-600">
                Comes with Dockerfile, GitHub Actions workflows, and deployment
                configurations ready for your CI/CD pipeline.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-semibold mb-4">
              Deliver great results in less time
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Save days or weeks creating your next Spring Boot application or
              microservice with Jiffy. 100% focused on production.
            </p>
            <Button
              onClick={() => setLocation("/generator")}
              className="px-6 py-3 text-lg bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg transition-all"
            >
              Create Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
