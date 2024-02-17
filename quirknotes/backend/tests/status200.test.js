test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
});

const SERVER_URL = "http://localhost:4000";

beforeEach(async () => {
    await fetch(`${SERVER_URL}/deleteAllNotes`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
})

test("/postNote - Post a note", async () => {
    const title = "NoteTitleTest";
    const content = "NoteTitleContent";

    const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content,
        }),
    });

    const postNoteBody = await postNoteRes.json();

    expect(postNoteRes.status).toBe(200);
    expect(postNoteBody.response).toBe("Note added succesfully.");
});

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    expect(getAllNotesRes.status).toBe(200);
    expect(getAllNotesRes.json.length).toBe(0);
});

test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
    const title1 = "note1";
    const content1 = "content1";
    const title2 = "note2";
    const content2 = "content2";
    await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title1,
            content: content1,
        }),
    });
    await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title2,
            content: content2,
        }),
    });

    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    expect(getAllNotesRes.status).toBe(200);
    const notes = await getAllNotesRes.json();
    expect(notes.response.length).toBe(2);
    expect(notes.response[0].title).toBe(title1);
    expect(notes.response[0].content).toBe(content1);
    expect(notes.response[1].title).toBe(title2);
    expect(notes.response[1].content).toBe(content2);
});

test("/deleteNote - Delete a note", async () => {
    const title = "note";
    const content = "content";
    const postedNoteRes = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content,
        }),
    });

    const postedNote = await postedNoteRes.json();

    const deleteNote = await fetch(`${SERVER_URL}/deleteNote/${postedNote.insertedId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    expect(deleteNote.status).toBe(200);
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    expect(getAllNotesRes.status).toBe(200);
    expect(getAllNotesRes.json.length).toBe(0);
});

test("/patchNote - Patch with content and title", async () => {
    const title1 = "note1";
    const content1 = "content1";
    const title2 = "note2";
    const content2 = "content2";
    const postedNoteRes = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title1,
            content: content1,
        }),
    });
    const postedNote = await postedNoteRes.json();

    const patchNote = await fetch(`${SERVER_URL}/patchNote/${postedNote.insertedId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title2,
            content: content2,
        }),
    });
    expect(patchNote.status).toBe(200);
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    expect(getAllNotesRes.status).toBe(200);
    const notes = await getAllNotesRes.json();
    expect(notes.response.length).toBe(1);
    expect(notes.response[0].title).toBe(title2);
    expect(notes.response[0].content).toBe(content2);
});

test("/patchNote - Patch with just title", async () => {
    const title1 = "note1";
    const title2 = "note2";
    const content = "content";
    const postedNoteRes = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title1,
            content: content,
        }),
    });
    const postedNote = await postedNoteRes.json();

    const patchNote = await fetch(`${SERVER_URL}/patchNote/${postedNote.insertedId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title2,
        }),
    });
    expect(patchNote.status).toBe(200);
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    expect(getAllNotesRes.status).toBe(200);
    const notes = await getAllNotesRes.json();
    expect(notes.response.length).toBe(1);
    expect(notes.response[0].title).toBe(title2);
    expect(notes.response[0].content).toBe(content);
});

test("/patchNote - Patch with just content", async () => {
    const title = "note";
    const content1 = "content1";
    const content2 = "content2";
    const postedNoteRes = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content1,
        }),
    });
    const postedNote = await postedNoteRes.json();

    const patchNote = await fetch(`${SERVER_URL}/patchNote/${postedNote.insertedId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: content2,
        }),
    });
    expect(patchNote.status).toBe(200);
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    expect(getAllNotesRes.status).toBe(200);
    const notes = await getAllNotesRes.json();
    expect(notes.response.length).toBe(1);
    expect(notes.response[0].title).toBe(title);
    expect(notes.response[0].content).toBe(content2);
});

test("/deleteAllNotes - Delete one note", async () => {
    const title = "note";
    const content = "content";
    await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content,
        }),
    });

    const deleteAllNotes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    expect(deleteAllNotes.status).toBe(200);
    const deleteAllNotesRes = await deleteAllNotes.json();
    expect(deleteAllNotesRes.response).toBe("1 note(s) deleted.");
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    expect(getAllNotesRes.status).toBe(200);
    expect(getAllNotesRes.json.length).toBe(0);
});

test("/deleteAllNotes - Delete three notes", async () => {
    const title = "note";
    const content = "content";
    await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content,
        }),
    });
    await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content,
        }),
    });
    await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content,
        }),
    });

    const deleteAllNotes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
    expect(deleteAllNotes.status).toBe(200);
    const deleteAllNotesRes = await deleteAllNotes.json();
    expect(deleteAllNotesRes.response).toBe("3 note(s) deleted.");
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    expect(getAllNotesRes.status).toBe(200);
    expect(getAllNotesRes.json.length).toBe(0);
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
    const title = "note";
    const content = "content";
    const postedNoteRes = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title,
            content: content,
        }),
    });
    const postedNote = await postedNoteRes.json();

    const patchNoteRes = await fetch(`${SERVER_URL}/updateNoteColor/${postedNote.insertedId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            color: "#FF0000"
        }),
    });
    expect(patchNoteRes.status).toBe(200);
    const patchNote = await patchNoteRes.json();
    expect(patchNote.message).toBe("Note color updated successfully.");
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    expect(getAllNotesRes.status).toBe(200);
    const notes = await getAllNotesRes.json();
    expect(notes.response.length).toBe(1);
    expect(notes.response[0].title).toBe(title);
    expect(notes.response[0].content).toBe(content);
    expect(notes.response[0].color).toBe("#FF0000");
});