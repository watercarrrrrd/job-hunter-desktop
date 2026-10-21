import type { ResumeContent } from '@shared/types';
import { range, SectionTitle } from './helpers';

interface ClassicTemplateProps {
  content: ResumeContent;
}

export default function ClassicTemplate({ content }: ClassicTemplateProps) {
  const { basic } = content;
  const contact = [basic.phone, basic.email].filter(Boolean).join(' · ');

  return (
    <div className="bg-white text-gray-900">
      <header className="border-b-2 border-gray-800 pb-4 text-center">
        <h1 className="text-2xl font-bold">{basic.name || '姓名'}</h1>
        {basic.jobIntention && (
          <p className="mt-1 text-sm font-medium text-gray-700">{basic.jobIntention}</p>
        )}
        {contact && <p className="mt-1 text-xs text-gray-500">{contact}</p>}
      </header>

      {basic.summary && (
        <section>
          <SectionTitle>个人简介</SectionTitle>
          <p className="whitespace-pre-wrap text-sm leading-6">{basic.summary}</p>
        </section>
      )}

      {content.educations.length > 0 && (
        <section>
          <SectionTitle>教育经历</SectionTitle>
          {content.educations.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold">{e.school}</span>
                <span className="text-xs text-gray-500">{range(e.start, e.end)}</span>
              </div>
              <p className="text-sm text-gray-700">
                {[e.major, e.degree, e.gpa ? `GPA ${e.gpa}` : ''].filter(Boolean).join(' · ')}
              </p>
              {e.description && (
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{e.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {content.experiences.length > 0 && (
        <section>
          <SectionTitle>实习 / 工作经历</SectionTitle>
          {content.experiences.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold">
                  {e.company}
                  {e.position ? ` · ${e.position}` : ''}
                </span>
                <span className="text-xs text-gray-500">{range(e.start, e.end)}</span>
              </div>
              {e.description && (
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{e.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {content.projects.length > 0 && (
        <section>
          <SectionTitle>项目经历</SectionTitle>
          {content.projects.map((p, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold">
                  {p.name}
                  {p.role ? ` · ${p.role}` : ''}
                </span>
                <span className="text-xs text-gray-500">{range(p.start, p.end)}</span>
              </div>
              {p.description && (
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{p.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {content.skills.length > 0 && (
        <section>
          <SectionTitle>技能</SectionTitle>
          <p className="text-sm leading-6">
            {content.skills.map((s) => (s.level ? `${s.name}（${s.level}）` : s.name)).join('、')}
          </p>
        </section>
      )}

      {content.activities.length > 0 && (
        <section>
          <SectionTitle>校园活动</SectionTitle>
          {content.activities.map((a, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold">
                  {a.name}
                  {a.role ? ` · ${a.role}` : ''}
                </span>
                <span className="text-xs text-gray-500">{range(a.start, a.end)}</span>
              </div>
              {a.description && (
                <p className="mt-1 whitespace-pre-wrap text-sm leading-6">{a.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {content.certificates.length > 0 && (
        <section>
          <SectionTitle>证书奖项</SectionTitle>
          {content.certificates.map((c, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold">{c.name}</span>
                <span className="text-xs text-gray-500">{c.date}</span>
              </div>
              {c.description && <p className="mt-1 text-sm leading-6">{c.description}</p>}
            </div>
          ))}
        </section>
      )}

      {content.selfEvaluation && (
        <section>
          <SectionTitle>自我评价</SectionTitle>
          <p className="whitespace-pre-wrap text-sm leading-6">{content.selfEvaluation}</p>
        </section>
      )}
    </div>
  );
}
