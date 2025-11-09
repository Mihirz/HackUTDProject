import asyncio
import subprocess  # We are still using subprocess

async def get_git_diff(workspace_path: str) -> str:
    """
    Gets the project status using 'git status --porcelain',
    which includes staged, unstaged, AND untracked files.
    
    Args:
        workspace_path: The absolute file path to the local git repository.
    """
    print(f"[Tool] get_git_status called with path: {workspace_path}")
    
    if not workspace_path:
        return "Error: No workspace_path provided."

    def run_git_operations():
        # This is the synchronous code that will run in a thread
        try:
            # Use 'git status --porcelain' to get a simple list
            # of all changed files, including untracked ones.
            result = subprocess.run(
                ["git", "-C", workspace_path, "status", "--porcelain"],
                capture_output=True, text=True, check=True
            )
            
            if not result.stdout:
                return "No changes (staged, unstaged, or untracked) found."
            
            print("[Tool] Returning REAL git status.")
            # We wrap the output for clarity for the LLM
            return f"--- GIT STATUS REPORT ---\n{result.stdout}"

        except subprocess.CalledProcessError as e:
            # This can happen if the directory isn't a git repo
            return f"Error running git status: {e.stderr}"
        except Exception as e:
            return f"An unexpected error occurred: {str(e)}"

    # Run the blocking subprocess calls in a separate thread
    return await asyncio.to_thread(run_git_operations)