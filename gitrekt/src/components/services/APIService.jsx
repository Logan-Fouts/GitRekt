import { Octokit } from "@octokit/rest";

class APIService {
  constructor(owner, repo) {
    this.repo = repo;
    this.owner = owner;
    this.token = process.env.NEXT_PUBLIC_TOKEN;
    this.octokit = new Octokit({ auth: this.token });
  }

  async getGeneralRepoInfo() {
    try {
      const response = await this.octokit.request('GET /repos/{owner}/{repo}', {
        owner: this.owner,
        repo: this.repo
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching repo info:", error);
      throw error;
    }
  }

  async getPullRequests() {
    try {
      const response = await this.octokit.pulls.list({
        owner: this.owner,
        repo: this.repo,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching pull requests:", error);
    }
  }

  async getBranches() {
    try {
      const response = await this.octokit.repos.listBranches({
        owner: this.owner,
        repo: this.repo,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  }

  async getIssues() {
    try {
      const response = await this.octokit.issues.listForRepo({
        owner: this.owner,
        repo: this.repo,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  }

  async getTags() {
    try {
      const response = await this.octokit.repos.listTags({
        owner: this.owner,
        repo: this.repo,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  }
}

export default APIService;