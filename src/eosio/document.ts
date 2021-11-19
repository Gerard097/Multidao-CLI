interface Content {
    label: string
    value: string[]
}

class ContentWrapper {
    label: string;
    value: any;
    type: string;

    constructor(content: Content) {
        this.label = content.label;
        this.value = content.value[1];
        this.type = content.value[0];
    }
}

type ContentGroup = Array<Content>;

export class DGDocument {
    content_groups: Array<ContentGroup>;
    hash: string;
    created_date: string;

    constructor(document: any) {
        this.content_groups = document.content_groups;
        this.hash = document.hash;
        this.created_date = document.created_date;
    }

    getGroupLabel(group: ContentGroup): string {
        //Asume content_group_label is always at index 0
        return group[0]?.value[1];
    }

    getGroup(groupLabel: string) { 
        return this.content_groups.find((group) => {
            return this.getGroupLabel(group) === groupLabel;   
        })
    }

    getContent(group: ContentGroup, contentLabel: string): ContentWrapper | undefined {
        let content = group.find((item) => item.label === contentLabel);

        if (content) {
            return new ContentWrapper(content);
        }

        return undefined;
    }

    getGroupContent(groupLabel: string, contentLabel: string) {
        let group = this.getGroup(groupLabel);

        if (group) {
            return this.getContent(group, contentLabel);
        }

        return undefined;
    }

    getDocumentType(): string {
        return this.getGroupContent('system', 'type')?.value ?? 'unkown';
    }

    getGroupString(group: ContentGroup): string {
        return (`${this.getGroupLabel(group)}: { ${group.map((content) => {
            return `${content.label}: ${content.value[1]} [${content.value[0]}]` 
        }).reduce((p, c) => p + '\n\t' + c, '')}
    }`)
    }

    getString(groups: string[]) {
        return (
`Hash: ${this.hash}
Created: ${this.created_date}
Content {
${this.content_groups.map((group) => {
if (groups.includes(this.getGroupLabel(group))) {
return `${this.getGroupString(group)}\n` 
}
return '';
}).reduce((p, c) => p + c)}}`
        )
    }
}