"use client";

import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

const initialDraftDetails = {
  fullName: "",
  preferredName: "",
  age: "",
  city: "",
  dateOfDeath: "",
  lifeDetail: "",
  survivedBy: "",
  precededBy: "",
  serviceDetails: "",
  memorialRequest: "",
  tone: "warm",
  length: "standard",
  privateService: false,
};

function sentence(text) {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function joinParts(parts) {
  return parts.filter(Boolean).join(" ");
}

function firstName(details) {
  return details.preferredName.trim() || details.fullName.trim() || "[First name]";
}

function buildOpening(details) {
  const name = details.fullName.trim() || "[Full name]";
  const age = details.age.trim() ? `, ${details.age.trim()},` : "";
  const city = details.city.trim() ? ` of ${details.city.trim()},` : "";
  const date = details.dateOfDeath.trim() ? ` on ${details.dateOfDeath.trim()}` : " on [date of death]";

  if (details.tone === "warm") {
    return `${name}${age}${city} died${date}. ${firstName(details)} will be remembered with care by family and friends.`;
  }

  return `${name}${age}${city} died${date}.`;
}

function buildDraft(details) {
  const nickname = firstName(details);
  const lifeSentence = details.lifeDetail.trim()
    ? sentence(`${nickname} will be remembered for ${details.lifeDetail.trim()}`)
    : `${nickname} will be remembered for [one specific habit, place, work, service, kindness, phrase, craft, or family role].`;
  const survived = details.survivedBy.trim() ? sentence(`${nickname} is survived by ${details.survivedBy.trim()}`) : "";
  const preceded = details.precededBy.trim() ? sentence(`${nickname} was preceded in death by ${details.precededBy.trim()}`) : "";
  const service = details.privateService
    ? "A private family service will be held."
    : details.serviceDetails.trim()
      ? sentence(`A service will be held ${details.serviceDetails.trim()}`)
      : "Service details will be shared by the family or funeral home when they are ready.";
  const memorial = details.memorialRequest.trim() ? sentence(`In memory of ${nickname}, ${details.memorialRequest.trim()}`) : "";

  if (details.length === "short") {
    return joinParts([buildOpening(details), lifeSentence, survived, service, memorial]);
  }

  if (details.length === "story") {
    return [
      buildOpening(details),
      lifeSentence,
      joinParts([survived, preceded]),
      joinParts([service, memorial]),
      "This draft can be shortened for a newspaper notice or expanded into a fuller online obituary story after the family verifies names, dates, service details, records, photographs, and privacy choices.",
    ].filter(Boolean).join("\n\n");
  }

  return [
    buildOpening(details),
    lifeSentence,
    joinParts([survived, preceded]),
    joinParts([service, memorial]),
  ].filter(Boolean).join("\n\n");
}

export function ObituaryDraftBuilder() {
  const [details, setDetails] = useState(initialDraftDetails);
  const [copyStatus, setCopyStatus] = useState("");
  const generatedDraft = useMemo(() => buildDraft(details), [details]);

  const updateField = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    setDetails((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setCopyStatus("");
  }, []);

  const resetDraft = useCallback(() => {
    setDetails(initialDraftDetails);
    setCopyStatus("");
  }, []);

  const copyDraft = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedDraft);
      setCopyStatus("Draft copied. Review it before sending to a newspaper, funeral home, or memorial site.");
    } catch {
      setCopyStatus("Copy failed. Select the draft text and copy it manually.");
    }
  }, [generatedDraft]);

  return (
    <section className="generator-tool" aria-labelledby="generator-tool-heading">
      <div className="generator-tool-heading">
        <div className="kicker">Draft builder</div>
        <h2 id="generator-tool-heading">Free Obituary Generator</h2>
        <p>All fields stay in your browser. Nothing is submitted to FinalNotes or stored on a server.</p>
      </div>

      <div className="generator-layout">
        <form className="generator-form" aria-label="Obituary draft details">
          <label className="generator-field">
            <span>Full name</span>
            <input name="fullName" value={details.fullName} onChange={updateField} placeholder="Eleanor Mae Carter" />
          </label>
          <label className="generator-field">
            <span>Preferred name</span>
            <input name="preferredName" value={details.preferredName} onChange={updateField} placeholder="Ellie" />
          </label>
          <label className="generator-field">
            <span>Age</span>
            <input name="age" value={details.age} onChange={updateField} placeholder="84" inputMode="numeric" />
          </label>
          <label className="generator-field">
            <span>City or community</span>
            <input name="city" value={details.city} onChange={updateField} placeholder="Cleveland, Ohio" />
          </label>
          <label className="generator-field">
            <span>Date of death</span>
            <input name="dateOfDeath" value={details.dateOfDeath} onChange={updateField} placeholder="May 12, 2026" />
          </label>
          <label className="generator-field">
            <span>Tone</span>
            <select name="tone" value={details.tone} onChange={updateField}>
              <option value="warm">Warm</option>
              <option value="plain">Plain</option>
              <option value="formal">Formal</option>
            </select>
          </label>
          <label className="generator-field">
            <span>Length</span>
            <select name="length" value={details.length} onChange={updateField}>
              <option value="short">Short notice</option>
              <option value="standard">Standard obituary</option>
              <option value="story">Story lead</option>
            </select>
          </label>
          <label className="generator-field generator-field-wide">
            <span>One real life detail</span>
            <textarea
              name="lifeDetail"
              value={details.lifeDetail}
              onChange={updateField}
              placeholder="the Sunday suppers she hosted, the garden she kept, the students she mentored"
              rows={3}
            />
          </label>
          <label className="generator-field generator-field-wide">
            <span>Survived by</span>
            <textarea name="survivedBy" value={details.survivedBy} onChange={updateField} placeholder="her spouse David, children Mia and Ben, and five grandchildren" rows={2} />
          </label>
          <label className="generator-field generator-field-wide">
            <span>Preceded in death by</span>
            <textarea name="precededBy" value={details.precededBy} onChange={updateField} placeholder="her parents, Ruth and Samuel, and her sister Joan" rows={2} />
          </label>
          <label className="generator-field generator-field-wide">
            <span>Service details</span>
            <textarea name="serviceDetails" value={details.serviceDetails} onChange={updateField} placeholder="at 2 p.m. Saturday at Maple Street Chapel" rows={2} />
          </label>
          <label className="generator-field generator-field-wide">
            <span>Memorial request</span>
            <textarea name="memorialRequest" value={details.memorialRequest} onChange={updateField} placeholder="gifts may be made to the verified scholarship fund or charity named by the family" rows={2} />
          </label>
          <label className="generator-check">
            <input name="privateService" type="checkbox" checked={details.privateService} onChange={updateField} />
            <span>Use private-service wording instead of public service details.</span>
          </label>
        </form>

        <aside className="generator-preview" aria-label="Generated obituary draft">
          <div>
            <div className="kicker">Editable output</div>
            <h3>Draft</h3>
          </div>
          <output>{generatedDraft}</output>
          <div className="generator-controls">
            <Button type="button" variant="primary" onClick={copyDraft}>Copy draft</Button>
            <Button type="button" onClick={resetDraft}>Reset</Button>
          </div>
          {copyStatus ? <p className="generator-status" role="status">{copyStatus}</p> : null}
        </aside>
      </div>
    </section>
  );
}
