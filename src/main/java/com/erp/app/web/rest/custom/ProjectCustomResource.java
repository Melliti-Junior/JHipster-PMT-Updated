package com.erp.app.web.rest.custom;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.custom.CustomProject;
import com.erp.app.repository.custom.ProjectCustomRepository;
import com.erp.app.repository.search.custom.ProjectCustomSearchRepository;
import com.erp.app.web.rest.errors.BadRequestAlertException;
import com.erp.app.web.rest.util.HeaderUtil;
import com.erp.app.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

@RestController
@RequestMapping("/api/custom")
public class ProjectCustomResource {

	private final Logger log = LoggerFactory.getLogger(ProjectCustomResource.class);

    private static final String ENTITY_NAME = "projectcustom";

    private final ProjectCustomRepository projectcustomRepository;

    private final ProjectCustomSearchRepository projectcustomSearchRepository;

    public ProjectCustomResource(ProjectCustomRepository projectcustomRepository, ProjectCustomSearchRepository projectcustomSearchRepository) {
        this.projectcustomRepository = projectcustomRepository;
        this.projectcustomSearchRepository = projectcustomSearchRepository;
    }

    /**
     * POST  /projectcustoms : Create a new projectcustom.
     *
     * @param projectcustom the projectcustom to create
     * @return the ResponseEntity with status 201 (Created) and with body the new projectcustom, or with status 400 (Bad Request) if the projectcustom has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/projectcustoms")
    @Timed
    public ResponseEntity<CustomProject> createProjectCustom(@Valid @RequestBody CustomProject projectcustom) throws URISyntaxException {
        log.debug("REST request to save CustomProject : {}", projectcustom);
        if (projectcustom.getId() != null) {
            throw new BadRequestAlertException("A new projectcustom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CustomProject result = projectcustomRepository.save(projectcustom);
        projectcustomSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/custom/projectcustoms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /projectcustoms : Updates an existing projectcustom.
     *
     * @param projectcustom the projectcustom to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated projectcustom,
     * or with status 400 (Bad Request) if the projectcustom is not valid,
     * or with status 500 (Internal Server Error) if the projectcustom couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/projectcustoms")
    @Timed
    public ResponseEntity<CustomProject> updateProjectCustom(@Valid @RequestBody CustomProject projectcustom) throws URISyntaxException {
        log.debug("REST request to update CustomProject : {}", projectcustom);
        if (projectcustom.getId() == null) {
            return createProjectCustom(projectcustom);
        }
        CustomProject result = projectcustomRepository.save(projectcustom);
        projectcustomSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, projectcustom.getId().toString()))
            .body(result);
    }

    /**
     * GET  /projectcustoms : get all the projectcustoms.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of projectcustoms in body
     */
    @GetMapping("/projectcustoms")
    @Timed
    public ResponseEntity<List<CustomProject>> getAllProjectCustoms(Pageable pageable) {
        log.debug("REST request to get a page of ProjectCustoms");
        Page<CustomProject> page = projectcustomRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/custom/projectcustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /projectcustoms/:id : get the "id" projectcustom.
     *
     * @param id the id of the projectcustom to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the projectcustom, or with status 404 (Not Found)
     */
    @GetMapping("/projectcustoms/{id}")
    @Timed
    public ResponseEntity<CustomProject> getProjectCustom(@PathVariable String id) {
        log.debug("REST request to get CustomProject : {}", id);
        CustomProject projectcustom = projectcustomRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(projectcustom));
    }

    /**
     * DELETE  /projectcustoms/:id : delete the "id" projectcustom.
     *
     * @param id the id of the projectcustom to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/projectcustoms/{id}")
    @Timed
    public ResponseEntity<Void> deleteProjectCustom(@PathVariable String id) {
        log.debug("REST request to delete CustomProject : {}", id);
        projectcustomRepository.delete(id);
        projectcustomSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/projectcustoms?query=:query : search for the projectcustom corresponding
     * to the query.
     *
     * @param query the query of the projectcustom search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/projectcustoms")
    @Timed
    public ResponseEntity<List<CustomProject>> searchProjectCustoms(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of ProjectCustoms for query {}", query);
        Page<CustomProject> page = projectcustomSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/custom/_search/projectcustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
