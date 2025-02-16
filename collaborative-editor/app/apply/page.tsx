"use client";
import React from "react";

export default function ApplyPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl mb-4">Apply Now</h1>
      <iframe
        className="airtable-embed"
        src="https://airtable.com/embed/appJg9h5I5wubZWja/pag4y927E1RQNRvmZ/form"
        frameBorder="0"
        width="100%"
        height="533"
        style={{ background: "transparent", border: "1px solid #ccc" }}
        title="Airtable Form"
      />
    </div>
  );
}