import { projectQuestions } from "@/content/questions";

export function ProjectQuestions() {
  return (
    <section
      className="section project-questions"
      aria-labelledby="questions-title"
    >
      <div className="questions-intro">
        <h2 id="questions-title">Before we begin.</h2>
        <p>
          A few useful answers for planning your home and your first
          conversation with us.
        </p>
      </div>
      <div className="questions-list">
        {projectQuestions.map((item) => (
          <details key={item.question}>
            <summary>
              <span>{item.question}</span>
              <span className="question-indicator" aria-hidden="true" />
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
